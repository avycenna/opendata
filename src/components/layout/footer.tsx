export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">About This Platform</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A government-backed transparency platform and reference use case for ADD open data, demonstrating the reusability of Morocco&apos;s public datasets aligned with Digital Morocco 2030.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">What is Open Data?</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Open data is freely available public information that can be reused, redistributed, and analyzed by anyone. This platform demonstrates the value of transparent, accessible educational infrastructure data.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Data Source</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All school data comes from official ADD datasets published at{' '}
            <a
              href="https://data.gov.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              data.gov.ma
            </a>
          </p>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Avycenna • Powered by ADD Open Data Platform •{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>{' '}
          •{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Use
          </a>
        </p>
      </div>
    </footer>
  );
}
