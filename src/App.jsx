import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import {Navbar,Welcome,Dock,Home} from "#components";
import {Finder, Resume, Safari, Terminal, Text, Image, Contact, Photos} from "#windows";

gsap.registerPlugin(Draggable);

const App = () => {
  return (
   <main>
    <Navbar />
    <Welcome />
    <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
       <Contact />
       <Photos />
       <Home />
    </main>
  );
};

export default App;