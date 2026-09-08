export const supabase = { from: () => ({ select: () => ({ or: () => Promise.resolve({ data: [] }) }) }) };
