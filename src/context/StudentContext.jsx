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

  useEffect(() => {
    // 🔥 Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchStudents(); // ✅ fetch AFTER login
          fetchDashboardStats();
          fetchNotifications();
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
    // TOTAL STUDENTS
    const { count: total } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    // PENDING APPLICATIONS
    const { count: pending } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .in("status", ["Inquiry", "Documents Pending", "Applied"]);

    // VISA APPROVED
    const { count: approved } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("status", "Visa Approved");

    setStats({
      totalStudents: total || 0,
      pendingApplications: pending || 0,
      visaApproved: approved || 0,
    });
  };
  useEffect(() => {
    const channel = supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        (payload) => {
          console.log("Realtime change:", payload);

          if (payload.eventType === "INSERT") {
            setStudents((prev) => [...prev, payload.new]);
          }

          if (payload.eventType === "UPDATE") {
            setStudents((prev) =>
              prev.map((s) => (s.id === payload.new.id ? payload.new : s))
            );
          }

          if (payload.eventType === "DELETE") {
            setStudents((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
          fetchDashboardStats();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const notifChannel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          fetchNotifications(); // ✅ ALWAYS REFETCH
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
  }, [page]);

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
      setNotifications(data);

      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } else {
      console.error(error);
    }
  };
  const createNotification = async ({ message, type, studentId }) => {
    const { error } = await supabase.from("notifications").insert([
      {
        message,
        type,
        student_id: studentId,
        read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Notification error:", error);
    }
  };

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
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
    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select();

    if (!error && data) {
      const newStudent = data[0];
      setStudents((prev) => [...prev, newStudent]);
      // 🔔 Notification
      await createNotification({
        message: `New student added: ${studentData.personal.firstName} ${studentData.personal.lastName}`,
        type: "new_student",
        studentId: newStudent.id,
      });
      toast.success("Student added ✅");
    } else {
      console.error(error);
      toast.error(error?.message || "Failed to add student ❌");
    }
  };

  // UPDATE STUDENT
  const updateStudent = async (id, updates) => {
    const student = students.find((s) => s.id === id);

    const newTimeline = [...(student.timeline || [])];

    if (updates.status && updates.status !== student.status) {
      newTimeline.push({
        id: Date.now(),
        message: `${student.personal?.firstName || ""} status updated to ${
          updates.status
        }`,
        date: new Date().toISOString(),
        type: "status",
      });

      // 🔔 Notification
      await createNotification({
        message: `${
          student.personal?.firstName || "Student"
        } status updated to ${updates.status}`,
        type: "status",
        studentId: id,
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
      setStudents((prev) => prev.map((s) => (s.id === id ? data[0] : s)));
      toast.success("Student updated ✏️");
      fetchDashboardStats();
    } else {
      console.error(error);
      toast.error(error?.message || "Update failed ❌");
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
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
