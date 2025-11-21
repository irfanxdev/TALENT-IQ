import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

// CREATE SESSION
export const useCreateSession = () => {
  return useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session created successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create room"),
  });
};

// ACTIVE SESSIONS (all open rooms)
export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });
};

// MY RECENT SESSIONS (used on dashboard)
export const useMyRecentSessions = () => {
  return useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });
};

// GET SESSION BY ID
export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000, // auto refresh every 5 seconds
  });
};

// JOIN SESSION
export const useJoinSession = (id) => {
  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: () => sessionApi.joinSession(id),
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to join session"),
  });
};

// END SESSION (fixed bug)
export const useEndSession = (id) => {
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: () => sessionApi.endSession(id), // FIXED
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });
};
