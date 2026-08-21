const fs = require('fs');

let createGroupModal = fs.readFileSync('src/features/chat/CreateGroupModal.tsx', 'utf-8');
createGroupModal = createGroupModal.replace(/\.or\([\s\S]*?\)/, ".or('user_id1.eq.' + activeUserId + ',user_id2.eq.' + activeUserId)");
fs.writeFileSync('src/features/chat/CreateGroupModal.tsx', createGroupModal);

let chatPanel = fs.readFileSync('src/features/chat/ChatPanel.tsx', 'utf-8');
chatPanel = chatPanel.replace(/className=\{\\?`([^`]+)\\?`\}/g, "className={`$1`}");
chatPanel = chatPanel.replace(/className=\{(.*?)\}/g, (match, p1) => {
  if (p1.includes('`') && p1.includes('\\`')) {
     return `className={${p1.replace(/\\`/g, '`')}}`;
  }
  return match;
});
// also fix ${
chatPanel = chatPanel.replace(/\\\$/g, '$');
fs.writeFileSync('src/features/chat/ChatPanel.tsx', chatPanel);
