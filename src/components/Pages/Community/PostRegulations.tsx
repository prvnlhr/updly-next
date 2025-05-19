import React from "react";

const PostRegulations = () => {
  return (
    <>
      {/* Posting Requirements */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          Posting Requirements
        </h2>
        <ul className="text-sm text-gray-300 space-y-2 pl-5 list-disc">
          <li>A Reddit account at least 1 day old</li>
          <li>A verified email address</li>
          <li>
            At least 5 Post karma to post (Post and Comment karma are different)
          </li>
          <li>
            You can only make 2 posts in 24 hours. Removed and deleted posts
            count towards the limit
          </li>
        </ul>
      </div>

      {/* Rules Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Rules</h2>
        <div className="space-y-4">
          {/* Rule 1 */}
          <div className="bg-[#0a0a0a] p-3 rounded-lg">
            <h3 className="font-medium text-white mb-1">
              1. Relevance/Off-Topic/No Political Discussions
            </h3>
            <p className="text-sm text-gray-300">
              All submissions and discussions should be about GTA6 or GTA6
              Online only. Off-topic posts and discussions will be removed.
              <br />
              <br />
              No political or controversial real-life persons discussions or
              posts are allowed at all.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-[#0a0a0a] p-3 rounded-lg">
            <h3 className="font-medium text-white mb-1">2. Be Respectful</h3>
            <p className="text-sm text-gray-300">
              Absolutely no hate-speech, racism, or homophobic/transphobic
              comments are allowed. This is a zero tolerance policy that will be
              strictly enforced and the user banned. In addition, disrespectful
              comments to, or harassing of other users here will result in a ban
              from this community. This includes displaying anyone&apos;s
              personal or confidential information or stalking.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#0a0a0a] p-3 rounded-lg">
            <h3 className="font-medium text-white mb-1">3. Spoilers</h3>
            <p className="text-sm text-gray-300">
              All posts containing spoilers MUST have the spoiler tag applied to
              it and the post title must also be spoiler free. Intentionally
              posting spoilers in comments will result in the user being muted
              or banned.
            </p>
          </div>

          {/* Additional rules... */}
          <div className="text-center pt-2">
            <button className="text-xs text-blue-500 hover:underline">
              Show all rules (6 more)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostRegulations;
