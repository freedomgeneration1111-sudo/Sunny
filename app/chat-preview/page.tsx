import type { Metadata } from "next";import { NativeChatPanel } from "@/components/operations/NativeChatPanel";import styles from "./chat-preview.module.css";
export const metadata:Metadata={title:"Native Chat Staging Preview",robots:{index:false,follow:false}};
export default function ChatPreviewPage(){return <div className={styles.preview}><div><p>Staging validation surface</p><h1>Native Focus Lab web chat</h1><p>This unlisted, noindex route exercises the chat seam without inserting it into the approved marketing header.</p></div><NativeChatPanel/></div>;}
