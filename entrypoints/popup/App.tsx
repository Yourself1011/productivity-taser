import { browser } from "wxt/browser";
import { FaGithub } from "react-icons/fa";

const App = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-16 h-[400px] w-[400px]">
      <div className="bg-white p-4 rounded-lg border">
        <h1 className="mb-2 text-2xl">Productivitazer</h1>
        <p className="mb-2 text-[15px]">
          H̶e̶l̶p̶i̶n̶g̶ Forcing you to break your bad habits
        </p>
        <button
          onClick={() => {
            browser.runtime.openOptionsPage();
          }}
        >
          settings
        </button>
      </div>
      <div className='absolute bottom-0 border-t border-t-neutral-200 bg-white p-2 left-0 w-full flex justify-between '>
        <p className='flex gap-2 items-center'>Copyright &#169; 2024</p>
        <a className='flex gap-2 items-center underline' href='https://github.com/Yourself1011/productivity-taser' target='_blank'><FaGithub /> GitHub</a>
      </div>
    </div>
  );
};

export default App;
