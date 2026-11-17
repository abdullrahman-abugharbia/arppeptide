/*
 * ARP Peptide — site configuration
 * --------------------------------
 * Edit the values below. This is the only place to change the order email.
 */
window.SITE = {
  // Brand name shown in the header logo and page titles.
  brand: 'ARP Peptide',

  // Logo mark shown to the left of the wordmark (set to '' to hide it).
  logoImage: 'assets/img/logo.png',

  // === IMPORTANT ===
  // The email address that customer orders are sent to.
  // Replace the placeholder below with your real order inbox, then save.
  ordersEmail: 'Info@arppeptide.com',   // TODO: replace with your real order email

  // Visitor counter on the home page. The number = base + real visits, kept in
  // a free shared counter (countapi.mileshilliard.com) so every visitor sees
  // the same total.
  //   base        -> the starting number. 4200 was the count when we moved off
  //                  the old Abacus counter (it went offline in Nov 2026).
  //   key         -> where the count is stored (keep unique to this site).
  //                  Changing it starts a new counter from 0 (+ base).
  //   perSession  -> true: +1 once per visit; false: +1 on every page view
  //   timeoutMs   -> how long to wait for the counter service before giving up
  visitorCounter: {
    base: 4200,
    key: 'arppeptide-com-visits',
    perSession: true,
    timeoutMs: 4000
  }
};
