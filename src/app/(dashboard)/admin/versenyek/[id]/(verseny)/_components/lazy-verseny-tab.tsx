"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";

export function LazyTabContent({ tabValue, id }: { tabValue: string, id: string }) {
  const pathname = usePathname();
  const activeTab = pathname.split("/").pop();

  if (activeTab !== tabValue) return null;

  const TabContent = dynamic(
    () => import(`@/app/(dashboard)/admin/versenyek/${id}/${tabValue}/page`),
    {
      loading: () => (
        <TabsContent value={tabValue}>
          <div className="p-4">Betöltés...</div>
        </TabsContent>
      ),
    }
  );

  return (
    <TabsContent value={tabValue}>
      <TabContent />
    </TabsContent>
  );
}