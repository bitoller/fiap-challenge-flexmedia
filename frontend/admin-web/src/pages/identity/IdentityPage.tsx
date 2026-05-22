import type { AdminCopy } from "../../admin/copy";

type IdentityPageProps = {
  copy: AdminCopy["identityPage"];
};

function IdentityPage({ copy }: IdentityPageProps) {
  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>{copy.title}</h2>
        <p className="admin-empty">{copy.message}</p>
      </div>
    </section>
  );
}

export default IdentityPage;
