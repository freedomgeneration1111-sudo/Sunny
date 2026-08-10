import type { Metadata } from "next";import { CommercialPage } from "@/components/sections/CommercialPage";import { pages,commonFaqs } from "@/lib/content/redesign";
export const metadata:Metadata={title:"South Asian Weddings"};export default function Page(){const page=pages.southAsian;return <CommercialPage hero={page.hero} blocks={page.blocks} faqs={commonFaqs}/>}
