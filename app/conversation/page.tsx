import type { Metadata } from "next";
import { ConversationResume } from "@/components/operations/ConversationResume";

export const metadata:Metadata={title:"Your Focus Lab Conversation",description:"Continue your private conversation with Focus Lab Productions.",robots:{index:false,follow:false},referrer:"no-referrer"};
export default function ConversationPage(){return <ConversationResume/>;}
