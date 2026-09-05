import api, { unwrap } from "./api"; import type { Dashboard } from "@/types";

const emptyDashboard: Dashboard = { statistics: { totalVideos: 0, completedVideos: 0, processingVideos: 0, failedVideos: 0 }, recentVideos: [] };

export const dashboardService = { get: () => api.get<unknown>("/dashboard").then((response) => { const value = unwrap<Partial<Dashboard>>(response) || {}; return { ...emptyDashboard, ...value, statistics: { ...emptyDashboard.statistics, ...(value.statistics || {}) }, recentVideos: value.recentVideos || [] }; }) };