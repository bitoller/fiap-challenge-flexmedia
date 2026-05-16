type PlaceholderPageProps = {
  title: string;
  message: string;
};

function PlaceholderPage({ title, message }: PlaceholderPageProps) {
  return (
    <section className="admin-panel">
      <div className="admin-card">
        <h2>{title}</h2>
        <p className="admin-empty">{message}</p>
      </div>
    </section>
  );
}

export default PlaceholderPage;
