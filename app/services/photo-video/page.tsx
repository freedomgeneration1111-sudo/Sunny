import type { Metadata } from "next";import { CommercialPage } from "@/components/sections/CommercialPage";import { pages,commonFaqs } from "@/lib/content/redesign";
export const metadata:Metadata={title:"Photo + Video"};export default function Page(){const page=pages.photoVideo;return <CommercialPage hero={page.hero} blocks={page.blocks} faqs={commonFaqs}/>}
