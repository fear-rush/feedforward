import React, { useState } from "react";
import { Tab } from "@headlessui/react";

import { UserAuth } from "../../context/AuthContext";

import GivenFoodTab from "../../components/Tab/GivenFoodTab";
import TakenFoodTab from "../../components/Tab/TakenFoodTab";
import FabButton from "../../components/Button/FabButton";

const ProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabItems = ["Makanan Diambil", "Makanan Diberi"];
  const { user } = UserAuth();

  return (
    <div className="grid grid-cols-1 mx-auto justify-items-center rounded-lg shadow-cardshadow max-w-5xl bg-white mb-4">
      <div className="px-6 pb-6 min-w-full min-h-screen">
        <div className="my-4">
          <h2 className="font-bold text-lg">Email</h2>
          <h2 className="font-light text-lg">{user.email}</h2>
          <h1 className="font-bold text-xl">Username</h1>
          <h1 className="font-light first-line:text-xl">{user.displayName}</h1>
        </div>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabItems.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <TakenFoodTab user={user} />
            </Tab.Panel>
            <Tab.Panel>
              <GivenFoodTab user={user} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <FabButton />
    </div>
  );
};

export default ProfilePage;
