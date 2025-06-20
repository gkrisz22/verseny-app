import { getCompetitionById } from "@/app/_data/competition.data";
import CompetitionContentForm from "./competition-content-form";

const VersenyMetadataPage = async ({ params } : {
  params: Promise<{ id: string }>;
} ) => {
  const id = (await params).id;
  const competition = await getCompetitionById(id);

  if (!competition) {
    return null; 
  }
  
  return (
    <CompetitionContentForm competition={competition} />
  );

  
}

export default VersenyMetadataPage