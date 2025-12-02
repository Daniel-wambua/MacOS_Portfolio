import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {socials} from "#constants/index.js";
import {WindowControls} from "#components";

const Contact = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2>Contact Me</h2>
            </div>
            <div className="p-5">
                <img
                    src="images/daniel2.png" 
                    alt="Daniel"
                    className="w-20 rounded-full"
                />
                <h3>Let's Connect</h3>
                <p>
                    Whether you have an innovative idea, a bug that needs squashing, 
                    an exciting hackathon or CTF opportunity, a job offer, or simply 
                    want to discuss technology—I'd love to hear from you.
                </p>
                <br />
                <a 
                    href="mailto:richiehavoc@proton.me" 
                    className="font-semibold hover:underline hover:text-blue-600"
                >
                    richiehavoc@proton.me
                </a>
                <br />
                <br />
                <ul>
                    {socials.map(({ id, bg, link, icon, text }) => (
                        <li 
                            key={id}
                            style={{ backgroundColor: bg }}
                        >
                            <a 
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={text}
                            >
                                <img 
                                    src={icon} 
                                    alt={text} 
                                    className="size-5" 
                                />
                                <p>{text}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
