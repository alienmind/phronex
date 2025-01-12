"use client"
import { useEffect, useRef } from 'react';
/*
 * This is the slides page - made with reveal.js
 * See https://revealjs.com/
 *     https://revealjs.com/react/
 */

import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css'; // "black" theme is just an example
import { createPortal } from 'react-dom';


/*
 * This is the content of the slides
 */
function SlidesContent({deckDivRef, deckRef}: {deckDivRef: React.RefObject<HTMLDivElement>, deckRef: React.RefObject<Reveal.Api>}) {
    return (
        <div className="reveal" ref={deckDivRef}>
            <div className="slides">
                <section>Slide 1</section>
                <section>Slide 2</section>
            </div>
        </div>
    );
}


/*
 * This is all of the boilerplate code for the slides being integrated in React
 */
export default function Slides() {
    const deckDivRef = useRef<HTMLDivElement>(null); // reference to deck container div
    const deckRef = useRef<Reveal.Api | null>(null); // reference to deck reveal instance

    useEffect(() => {
        // Prevents double initialization in strict mode
        if (deckRef.current) return;

        deckRef.current = new Reveal(deckDivRef.current!, {
            transition: "slide",
            // other config options
        });

        deckRef.current.initialize().then(() => {
            // good place for event handlers and plugin setups
        });

        return () => {
            try {
                if (deckRef.current) {
                    deckRef.current.destroy();
                    deckRef.current = null;
                }
            } catch (e) {
                console.warn("Reveal.js destroy call failed.");
            }
        };
    }, []);

    return (
      <div>
      <div id="slides"/>
      {createPortal(
        // Your presentation is sized based on the width and height of
        // our parent element. Make sure the parent is not 0-height.
        <SlidesContent {...{deckDivRef, deckRef}}/>,
        document.body
      )}
      </div>
    );
}
