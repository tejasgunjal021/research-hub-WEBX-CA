import React, { useState } from "react";

interface Group {
  id: number;
  name: string;
}

interface Message {
  text: string;
  sender: string;
}

const DiscussionPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: "AI & Machine Learning" },
    { id: 2, name: "Blockchain & Crypto" },
    { id: 3, name: "Quantum Computing" },
    { id: 4, name: "Cybersecurity" },
    { id: 5, name: "Climate Change Tech" },
  ]);

  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [activeChat, setActiveChat] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});

  // Join a group
  const joinGroup = (group: Group) => {
    if (!joinedGroups.some((g) => g.id === group.id)) {
      setJoinedGroups([...joinedGroups, group]);
    }
  };

  // Create a new group
  const createGroup = () => {
    if (newGroupName.trim() !== "") {
      const newGroup = { id: groups.length + 1, name: newGroupName };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
    }
  };

  // Open chat for a group
  const openChat = (group: Group) => {
    setActiveChat(group);
  };

  // Handle sending messages
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [activeChat!.id]: [...(prev[activeChat!.id] || []), { text, sender: "You" }],
    }));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Left Section: Available Groups & Create Group */}
      <div className="w-1/4 p-4 bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-green-400">Available Groups</h2>
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"
            >
              <span>{group.name}</span>
              <button
                onClick={() => joinGroup(group)}
                className="bg-green-500 px-3 py-1 rounded-lg text-black font-semibold hover:bg-green-400 transition"
              >
                Join
              </button>
            </div>
          ))}
        </div>

        {/* Create Group Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-green-400">Create a Group</h2>
          <div className="flex">
            <input
              type="text"
              placeholder="Group name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={createGroup}
              className="bg-green-500 px-4 py-2 text-black font-semibold rounded-r-lg hover:bg-green-400 transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Chat Window */}
      <div className="w-1/2 p-6 flex flex-col justify-center items-center">
        {activeChat ? (
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">{activeChat.name} - Chat</h2>
            <div className="bg-gray-800 p-4 rounded-lg h-96 overflow-y-auto">
              {(messages[activeChat.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-md ${
                    msg.sender === "You" ? "bg-green-500 text-black text-right" : "bg-gray-600 text-white"
                  }`}
                >
                  {msg.sender}: {msg.text}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex mt-4">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage((e.target as HTMLInputElement).value);
                }}
              />
              <button
                onClick={() => sendMessage("Hello!")}
                className="bg-green-500 px-6 py-3 text-black font-semibold rounded-r-lg hover:bg-green-400 transition"
              >
                Send
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setActiveChat(null)}
              className="mt-4 bg-red-500 px-6 py-2 rounded-lg text-white hover:bg-red-400 transition"
            >
              Back to Groups
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg">Select a joined group to start chatting.</p>
        )}
      </div>

      {/* Right Section: Joined Groups */}
      <div className="w-1/4 p-4 bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-green-400">Joined Groups</h2>
        {joinedGroups.length === 0 ? (
          <p className="text-gray-400">You haven't joined any groups yet.</p>
        ) : (
          <ul className="space-y-2">
            {joinedGroups.map((group) => (
              <li
                key={group.id}
                onClick={() => openChat(group)}
                className="cursor-pointer bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
              >
                {group.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DiscussionPage;
