
const fs = require('fs');
let code = fs.readFileSync('src/lib/api.ts', 'utf8');

const fetchAllUserDataOld = \export async function fetchAllUserData(userId: string) {
  if (!isSupabaseConfigured()) return null

  const [profile, progression, goals, projects, skills, achievements, badges, settings, friends, chat] = await Promise.all([
    fetchRow<UserProfile>(TABLES.profile, userId, 'profile'),
    fetchRow<Progression>(TABLES.progression, userId, 'progression'),
    fetchRow<Goal[]>(TABLES.goals, userId, 'goals'),
    fetchRow<Project[]>(TABLES.projects, userId, 'projects'),
    fetchRow<Skill[]>(TABLES.skills, userId, 'skills'),
    fetchRow<Achievement[]>(TABLES.achievements, userId, 'achievements'),
    fetchRow<Badge[]>(TABLES.badges, userId, 'badges'),
    fetchRow<Settings>(TABLES.settings, userId, 'settings'),
    fetchRow<FriendState>(TABLES.profile, userId, 'friends'),
    fetchRow<ChatState>(TABLES.profile, userId, 'chat'),
  ])

  return { profile, progression, goals, projects, skills, achievements, badges, settings, friends, chat }
}\;

const fetchAllUserDataNew = \export async function fetchAllUserData(userId: string) {
  if (!isSupabaseConfigured() || !supabase) return null;

  const profile = await fetchRow<UserProfile>(TABLES.profile, userId, 'profile');
  
  const { data: { session } } = await supabase.auth.getSession();
  const isOwner = session?.user?.id === userId;
  const isPublic = profile?.isPublic !== false;

  if (!isPublic && !isOwner) {
    return null;
  }

  const [progression, goals, projects, skills, achievements, badges, settings, friends, chat] = await Promise.all([
    fetchRow<Progression>(TABLES.progression, userId, 'progression'),
    fetchRow<Goal[]>(TABLES.goals, userId, 'goals'),
    fetchRow<Project[]>(TABLES.projects, userId, 'projects'),
    fetchRow<Skill[]>(TABLES.skills, userId, 'skills'),
    fetchRow<Achievement[]>(TABLES.achievements, userId, 'achievements'),
    fetchRow<Badge[]>(TABLES.badges, userId, 'badges'),
    fetchRow<Settings>(TABLES.settings, userId, 'settings'),
    fetchRow<FriendState>(TABLES.profile, userId, 'friends'),
    fetchRow<ChatState>(TABLES.profile, userId, 'chat'),
  ]);

  return { profile, progression, goals, projects, skills, achievements, badges, settings, friends, chat };
}\;

code = code.replace(fetchAllUserDataOld, fetchAllUserDataNew);

const findProfileOld = \  const profile = data?.find((row) => {
    const profileData = row.data as UserProfile
    return profileData.username?.toLowerCase() === username.toLowerCase()
  })\;

const findProfileNew = \  const profile = data?.find((row) => {
    const profileData = row.data as UserProfile
    return profileData.username?.toLowerCase() === username.toLowerCase() && profileData.isPublic !== false
  })\;

code = code.replace(findProfileOld, findProfileNew);

fs.writeFileSync('src/lib/api.ts', code);

