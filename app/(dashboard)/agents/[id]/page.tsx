import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AgentDetails } from "@/components/agents/agent-details";

interface AgentPageProps {
  params: {
    id: string;
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return <AgentDetails agentId={params.id} />;
}
