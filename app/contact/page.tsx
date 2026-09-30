"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
export default function ContactPage() {
  const [notice, setNotice] = useState("");
  return <><div className="page-intro"><div className="eyebrow">RNT / GET IN TOUCH</div><h1>Start a <span className="serif-italic">conversation.</span></h1><p>Questions about a concept, a collaboration, or how this storefront works?</p></div><section className="section contact-layout"><div><div className="section-kicker">WE’RE LISTENING</div><h2>Make the next<br/>move together.</h2><p>Business contact details and message delivery will be added when the brand’s official channels are configured.</p></div><form className="form-card" onSubmit={(event) => { event.preventDefault(); setNotice("This demonstration form does not send messages. Configure a verified contact channel before launch."); }}><div className="form-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required/></div><div className="form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required/></div><div className="form-field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" required/></div><button className="button-primary" type="submit">Send a note <ArrowRight size={15}/></button>{notice && <p className="form-note" role="status">{notice}</p>}</form></section></>;
}
