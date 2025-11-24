import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import {Navbar,Welcome,Dock} from "#components";
import { Terminal } from "#windows";

gsap.registerPlugin(Draggable);

const App = () => {
  return (
   <main>
    <Navbar />
    <Welcome />
    <Dock />

       <Terminal />
    </main>
  );
};

export default App;