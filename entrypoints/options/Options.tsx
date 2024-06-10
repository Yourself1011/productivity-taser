import { useState, useEffect, ChangeEvent } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useImmer } from "use-immer";
import { storage } from "wxt/storage";
import Fuse from "fuse.js";

import { website } from "../types";

import { FaTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { AiOutlineNodeIndex } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";

const Options = () => {
  const [websites, setWebsites] = useImmer<website[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [status, setStatus] = useState<"none" | "saving" | "unsaved" | "saved">(
    "none"
  );
  const [serial, setSerial] = useState<boolean>(false);

  const [websitesAnimationElement, enableAnimation] = useAutoAnimate();

  function search(sites: website[]) {
    const options = {
      includeScore: false,
      includeMatches: true,
      threshold: 0.2,
      keys: ["name"],
    };
    const fuse = new Fuse(sites, options);
    if (searchString.length === 0) return websites;

    const results = fuse.search(searchString);
    return results.map((results) => results.item);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await storage.setItem("local:websites", websites);
    setStatus("saved");
  }

  const updateDraft = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    updatedProperty: keyof website
  ) => {
    setWebsites((draftWebsites) => {
      draftWebsites[index] = {
        ...draftWebsites[index],
        [updatedProperty]: e.target.value,
      };
    });
    setStatus("unsaved");
  };

  useEffect(() => {
    (async () => {
      const fetchedWebsites = (await storage.getItem(
        "local:websites"
      )) as website[];
      if (fetchedWebsites) setWebsites(fetchedWebsites);
      else setWebsites([]);
    })();
  }, []);

  return (
    <div className="p-16">
      <div className="flex justify-between items-center flex-col md:flex-row mb-4">
        <h1 className="text-3xl">Blocked Websites</h1>
        <div className='flex items-center gap-4'>
          <span className={`text-base bg-[#fcfcfc] transition-colors duration-300
            ${status === "none" && "text-slate-700"}
            ${status === "saving" && "text-yellow-700"}
            ${status === "saved" && "text-green-700"}
            ${status === "unsaved" && "text-yellow-500"}
          `}>
            {status === "none" && (
              <span>No Changes</span>
            )}
            {status === "saving" && (
              <span>Saving...</span>
            )}
            {status === "saved" && (
              <span>Saved</span>
            )}
            {status === "unsaved" && (
              <span>Unsaved Changes</span>
            )}
            {' •'}
          </span>
          <div className='relative'>
            <input
              placeholder="Search..."
              className="py-2 px-2 bg-gray-100 border border-gray-200 rounded outline-none hover:bg-gray-200 hover:border-gray-300 focus:border-gray-400 text-base w-full pl-8"
              value={searchString}
              name={`search`}
              onFocus={() => enableAnimation(false)}
              onBlur={() => enableAnimation(true)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearchString(e.target.value);
              }}
            ></input>
            <div className="absolute left-2 top-[11px]">
              <IoMdSearch size={20} />
            </div>
        </div>
        </div>
      </div>

      <form onSubmit={save}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          ref={websitesAnimationElement}
        >
          {search(websites).map((website: website, index: number) => (
            <div className="shadow-lg !h-full border border-slate-100 bg-white p-4 rounded-2xl relative" key={`options-website-${index}`}>
              <div className="flex items-center justify-between gap-2">
                <input
                  className="text-xl font-bold w-full outline-none bg-transparent"
                  value={website.name}
                  key={`input-${index.toString()}`}
                  onChange={(e) => updateDraft(e, index, "name")}
                  name={`name-${index.toString()}`}
                />
                {/* {website.url.length > 0 && (
                  <img
                    src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${website.url}`}
                    className={'w-4 h-4'} // Hide if error
                  />
                )} */}
              </div>
              <input
                className="w-full mb-0 outline-none bg-transparent text-[14px]"
                value={website.description}
                onChange={(e) => updateDraft(e, index, "description")}
                name={`description-${index.toString()}`}
              />
              <div className="flex items-center gap-2 mt-2 justify-between">
                <input
                  className="w-full focus:border-slate-300 border border-slate-200 p-1 rounded-md outline-none bg-transparent text-[14px]"
                  value={website.url}
                  id={`url-${index.toString()}`}
                  placeholder="Keyword, URL or regex"
                  onChange={(e) => updateDraft(e, index, "url")}
                  name={`url-${index.toString()}`}
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Visited {website.visits} times
              </p>
              <span
                className="absolute right-3 bottom-3 text-slate-500 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => {
                  enableAnimation(false);
                  setStatus("unsaved");
                  setWebsites((draftWebsites) => {
                    draftWebsites.splice(index, 1);
                  });
                }}
              >
                <FaTrashCan />
              </span>
            </div>
          ))}
          <button
            type="button"
            className="shadow-lg min-h-[150px] border border-slate-100 bg-white p-4 rounded-2xl text-black text-xl hover:bg-neutral-50 transition-colors h-full"
            onClick={() => {
              enableAnimation(true);
              setWebsites([
                ...websites,
                {
                  name: "New website",
                  url: "",
                  description: "Description",
                  visits: 0,
                },
              ]);
              setStatus("unsaved");
            }}
          >
            + Add
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            type="submit"
            className="flex items-center justify-center gap-2"
          >
            <FaCheck /> Save
          </button>
        </div>
      </form>

      <div>
        <h1 className="text-3xl mt-8">Serial</h1>
        <p>{serial ? <>Connected!</> : <>No serial connected, yet.</>}</p>
      </div>
      <button
        className="flex contrast items-center justify-center gap-2 mt-4"
        onClick={async () => {
          const port = await navigator.serial.requestPort();

          await port.open({ baudRate: 9600 });
          console.log(
            JSON.stringify(port, function (key, value) {
              return value === undefined ? "undefined" : value;
            })
          );
          setSerial(true);

          const writer = port.writable?.getWriter();

          await writer?.write(new Uint8Array([1]));
          writer?.releaseLock();
        }}
      >
        <AiOutlineNodeIndex /> Connect
      </button>

      <div className="absolute bottom-0 border-t border-t-neutral-200 bg-white left-0 w-full flex justify-between p-6 text-base">
        <p className="flex gap-2 items-center">Copyright &#169; 2024</p>
        <div className="flex items-center gap-8">
          <a
            className="flex gap-2 items-center underline"
            href="https://github.com/Yourself1011/productivity-taser"
            target="_blank"
          >
            <FaGithub /> GitHub
          </a>
          <a
            className="flex gap-2 items-center underline"
            href="https://devpost.com/software/lostazer"
            target="_blank"
          >
            <SiDevpost /> Devpost
          </a>
        </div>
      </div>
      <div>
        <h1 className="text-3xl mt-8">Stand Up Reminder</h1>
        <p>Get reminded to stand up</p>
      </div>
    </div>
  );
};

export default Options;
