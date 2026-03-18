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

  useEffect(() => {
    // 🔥 Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchStudents(); // ✅ fetch AFTER login
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
      }
    };

    checkUser();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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

    // SEARCH

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
    }

    setLoading(false);
    // console.log("Search:", search);
    // console.log("Data:", data);
    // console.log("Error:", error);
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

    if (!error) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? data[0] : s))
      );
      toast.success("Note added 📝");
    } else {
      toast.error("Failed to add note ❌");
    }
  };

  // ADD STUDENT
  const addStudent = async (studentData) => {
    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select();

    if (!error) {
      setStudents((prev) => [...prev, data[0]]);
      toast.success("Student added ✅");
    } else {
      toast.error("Failed ❌");
    }
  };

  // UPDATE STUDENT
  const updateStudent = async (id, updates) => {
    const student = students.find((s) => s.id === id);

    const newTimeline = [...(student.timeline || [])];

    if (updates.status && updates.status !== student.status) {
      newTimeline.push({
        id: Date.now(),
        message: `Status changed from ${student.status} to ${updates.status}`,
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

    if (!error) {
      setStudents((prev) => prev.map((s) => (s.id === id ? data[0] : s)));
      toast.success("Student updated ✏️");
    } else {
      toast.error("Update failed ❌");
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    await supabase.from("students").delete().eq("id", id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast.success("Student deleted 🗑️");
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

        addStudent,
        updateStudent,
        deleteStudent,
        addNote,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
