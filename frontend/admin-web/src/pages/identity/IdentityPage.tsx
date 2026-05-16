type IdentityPageProps = {
  title: string;
  message: string;
};

function IdentityPage({ title, message }: IdentityPageProps) {
  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>{title}</h2>
        <p className="admin-empty">{message}</p>
      </div>
    </section>
  );
}

export default IdentityPage;
