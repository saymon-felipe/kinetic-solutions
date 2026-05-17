type BlogLoaderProps = {
  title: string;
  message: string;
};

export default function BlogLoader({ title, message }: BlogLoaderProps) {
  return (
    <div className="blog-loader-shell" role="status" aria-live="polite">
      <div className="blog-loader-mark" aria-hidden="true">
        <span className="blog-loader-ring" />
        <span className="blog-loader-orbit" />
        <img src="/img/ksi_lab.png" alt="" className="blog-loader-logo" />
      </div>

      <div className="blog-loader-copy">
        <p className="blog-loader-kicker">KSI LAB</p>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>

      <div className="blog-loader-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
