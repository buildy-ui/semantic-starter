export function SiteLogo() {
  return (
    <a href="/" className="site-logo">
      <div className="site-logo__container">
        <span className="latty latty-box site-logo__icon"></span>
        <span className="site-logo__text">UI8Kit</span>
      </div>
    </a>
  );
}

/*
CSS for semantic classes:

.site-logo {
  @apply inline-block;
}

.site-logo__container {
  @apply flex items-center gap-2;
}

.site-logo__icon {
  @apply latty latty-box text-teal-500;
}

.site-logo__text {
  @apply text-lg font-bold;
}
*/
