import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // 10 per page
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApplications: 0,
    visaApproved: 0,
  });
  const [analytics, setAnalytics] = useState({
    status: {},
    countries: {},
    monthly: {},
  });

  useEffect(() => {
    // 🔥 Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchStudents(); // ✅ fetch AFTER login
          fetchDashboardStats();
          fetchNotifications();
          fetchAnalytics();
        } else {
          setStudents([]); // clear on logout
        }
      }
    );

    // 🔥 Also check if already logged in (refresh case)
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        fetchStudents();
        fetchDashboardStats();
        fetchNotifications();
      }
    };

    checkUser();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const fetchDashboardStats = async () => {
    const { data, error } = await supabase.rpc("get_dashboard_stats");

    if (!error && data) {
      setStats(data);
    } else {
      console.error(error);
    }
  };
  useEffect(() => {
    const channel = supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => {
          fetchStudents(page); // ✅ refresh list
          fetchDashboardStats(); // ✅ update KPI
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page]);
  //Notification changes
  useEffect(() => {
    const notifChannel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => {
            const exists = prev.find((n) => n.id === payload.new.id);
            if (exists) return prev;

            if (payload.new.read) return prev;

            // ✅ ONLY increase count if actually adding
            setUnreadCount((count) => count + 1);

            return [payload.new, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
    };
  }, []);

  // when filters change → reset page
  useEffect(() => {
    if (search.trim() === "") {
      fetchStudents(1); // load all again
    } else {
      const delay = setTimeout(() => {
        fetchStudents(1);
      }, 400); // debounce

      return () => clearTimeout(delay);
    }
  }, [status, country, sortBy]);

  // when page changes
  useEffect(() => {
    fetchStudents(page);
  }, [page, search, status, country]);

  //Analytics
  const fetchAnalytics = async () => {
    const { data, error } = await supabase.rpc("get_analytics");

    if (!error && data) {
      setAnalytics(data);
    } else {
      console.error("Analytics error:", error);
    }
  };

  // FETCH STUDENTS
  const fetchStudents = async (pageNumber = 1) => {
    setLoading(true);

    const from = (pageNumber - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("students").select("*", { count: "exact" });

    // STATUS
    if (status) {
      query = query.eq("status", status);
    }

    // COUNTRY
    if (country) {
      query = query.eq("academic->>preferredCountry", country);
    }
    //search
    if (search) {
      query = query.or(
        `personal->>firstName.ilike.%${search}%,personal->>lastName.ilike.%${search}%`
      );
    }
    // SORT
    if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "name") {
      query = query.order("personal->>firstName", { ascending: true });
    }

    const { data, error, count } = await query.range(from, to);

    if (!error) {
      setStudents(data);
      setTotalCount(count);
      setPage(pageNumber);
    } else {
      console.error(error);
      toast.error("Failed to load students ❌");
    }

    setLoading(false);
    // console.log("Search:", search);
    // console.log("Data:", data);
    // console.log("Error:", error);
  };
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setNotifications(data.filter((n) => !n.read)); // 🔥 only unread

      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } else {
      console.error(error);
    }
  };

  //Create Notifications
  const createNotification = async ({ message, type, studentId }) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { error } = await supabase.from("notifications").insert([
      {
        message,
        type,
        student_id: studentId,
        read: false,
        user_id: user.id, // ✅ ADD THIS
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Notification error:", error);
    }
  };
  //Mark as read
  const markAsRead = async (id) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Mark read error:", error);
      return;
    }

    // ✅ REMOVE from UI (not update)
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // ADD NOTE
  const addNote = async (studentId, message) => {
    const student = students.find((s) => s.id === studentId);

    const newNote = {
      id: Date.now(),
      message,
      author: "Admin",
      date: new Date().toISOString(),
    };

    const updatedNotes = [...(student.notes ?? []), newNote];
    const { data, error } = await supabase
      .from("students")
      .update({ notes: updatedNotes })
      .eq("id", studentId)
      .select();

    if (!error && data) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? data[0] : s))
      );
      // 🔔 Notification
      await createNotification({
        message: `New note added for ${
          student.personal?.firstName || "student"
        }`,
        type: "note",
        studentId: studentId,
      });
      toast.success("Note added 📝");
    } else {
      console.error(error);
      toast.error(error?.message || "Failed to add note ❌");
    }
  };

  // ADD STUDENT
  const addStudent = async (studentData) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          ...studentData,
          user_id: user.id, // ✅ ADD THIS
        },
      ])
      .select();

    if (!error && data) {
      const newStudent = data[0];

      await fetchStudents(1); // ✅ correct data
      await fetchDashboardStats(); // ✅ KPI sync

      await createNotification({
        message: `New student added: ${studentData.personal.firstName} ${studentData.personal.lastName}`,
        type: "new_student",
        studentId: newStudent.id,
      });

      toast.success("Student added ✅");
    } else {
      console.error(error);
    }
  };

  // UPDATE STUDENT
  const updateStudent = async (id, updates) => {
    const student = students.find((s) => s.id === id);

    const newTimeline = [...(student.timeline || [])];

    let isStatusChanged = false;

    // ✅ STATUS CHANGE ONLY
    if (updates.status && updates.status !== student.status) {
      isStatusChanged = true;

      newTimeline.push({
        id: Date.now(),
        message: `${
          student.personal?.firstName || "Student"
        } status updated to ${updates.status}`,
        date: new Date().toISOString(),
        type: "status",
      });
    }

    const { data, error } = await supabase
      .from("students")
      .update({
        ...updates,
        timeline: newTimeline,
      })
      .eq("id", id)
      .select();

    if (!error && data) {
      await fetchStudents(page);
      await fetchDashboardStats();
      fetchAnalytics();

      // 🔥 ONLY CREATE NOTIFICATION IF STATUS CHANGED
      if (isStatusChanged) {
        await createNotification({
          message: `${
            student.personal?.firstName || "Student"
          } status updated to ${updates.status}`,
          type: "status",
          studentId: id,
        });
      }

      toast.success("Student updated ✏️");
    } else {
      console.error(error);
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (!error) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success("Student deleted 🗑️");
      fetchDashboardStats();
    } else {
      console.error(error);
      toast.error("Delete failed ❌");
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        page,
        totalCount,
        limit,
        fetchStudents,
        setPage,
        search,
        setSearch,
        status,
        setStatus,
        country,
        setCountry,
        sortBy,
        setSortBy,
        stats,
        addStudent,
        updateStudent,
        deleteStudent,
        addNote,
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        analytics,
        fetchAnalytics,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
