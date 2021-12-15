import React, { useCallback, useState, useContext, useEffect } from "react";
import { useCountState } from "../src/app-context";
import { CreateInstance } from "../src/axios";
import { oembed } from "@loomhq/loom-embed";
import Toast from "./toast";

import FadeIn from "react-fade-in";
import EmptyState from "../components/empty-state";
import useStorefront from "../hooks/useStorefront";

export default function VideoReply({ onComplete = () => {} }) {
  const state = useCountState();
  const { data: storefront } = useStorefront();
  const instance = CreateInstance(state);

  const [body, setBody] = useState();
  const [alias, setAlias] = useState(storefront?.account?.alias);
  const [position, setPosition] = useState(
    storefront?.account?.position ?? "Support"
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onComplete();
    handleSend();
  };

  const handleSend = useCallback(async () => {
    // Prevent multiple sends under the same email address
    const input = { customer_email: storefront.email, body, alias, position };

    await instance
      .post(`/${storefront.username}/storefront/videos/reply`, input)
      .then((res) => Toast({ message: "Message sent", success: true }))
      .catch((err) => console.error(err));

    await instance
      .put(`/${storefront.username}/storefront`, {
        compatible: Date.now(),
        account: { alias, position, ...(storefront?.account ?? {}) },
      })
      .catch((err) => console.error(err));
  }, [body, alias, position]);

  return (
    <FadeIn className="flex items-center justify-center flex-1 h-full">
      <EmptyState
        src="/logos/primary-logo-icon.png"
        quote="You can reply back to new videos from our app and get notified if your response resulted in a new order. Try it out by sending yourself a test message."
        footer={
          <React.Fragment>
            <form className="mt-5" action="#" onSubmit={handleSubmit}>
              <div>
                <div
                  className="flex items-center"
                  aria-orientation="horizontal"
                  role="tablist"
                >
                  <button
                    id="tabs-1-tab-1"
                    className="text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
                    aria-controls="tabs-1-panel-1"
                    role="tab"
                    type="button"
                  >
                    To: (yourself) {storefront.email}
                  </button>
                </div>
                <div className="mt-2">
                  <div
                    id="tabs-1-panel-1"
                    className="p-0.5 -m-0.5 rounded-lg"
                    aria-labelledby="tabs-1-tab-1"
                    role="tabpanel"
                    tabindex="0"
                  >
                    <label for="comment" className="sr-only">
                      Comment
                    </label>
                    <div>
                      <textarea
                        rows="4"
                        required
                        name="comment"
                        id="comment"
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Thanks for sending us a video message! I listed to your question and yes -- our products are cruelty-free! I recommend trying the 'Rose' lipstick if you prefer Autumn color palettes. :) "
                      ></textarea>
                    </div>
                  </div>
                  <div
                    id="tabs-1-panel-2"
                    className="p-0.5 -m-0.5 rounded-lg"
                    aria-labelledby="tabs-1-tab-2"
                    role="tabpanel"
                    tabindex="0"
                  ></div>
                </div>
              </div>

              <div className="mt-2 -space-y-px bg-white rounded-md shadow-sm isolate">
                <div className="relative px-3 py-2 border border-gray-300 rounded-md rounded-b-none focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                  <label
                    for="name"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Your mame
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={alias}
                    onChange={(event) => setAlias(event.target.value)}
                    className="flex-1 block w-full p-0 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 sm:text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="relative px-3 py-2 border border-gray-300 rounded-md rounded-t-none focus-within:z-10 focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                  <label
                    for="job-title"
                    className="block w-full text-xs font-medium text-gray-700"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job-title"
                    id="job-title"
                    required
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                    className="block w-full p-0 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 sm:text-sm"
                    placeholder="Support engineer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send message
                </button>
                <div
                  onClick={onComplete}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Skip
                </div>
              </div>
            </form>
          </React.Fragment>
        }
      />
    </FadeIn>
  );
}
