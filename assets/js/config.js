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

  // Visitor counter shown in the footer. The number = base + real visits, kept
  // in a free shared counter (Abacus API) so every visitor sees the same total.
  //   base        -> the starting number (3000)
  //   namespace/key -> where the count is stored (keep unique to this site)
  //   perSession  -> true: +1 once per visit; false: +1 on every page view
  visitorCounter: {
    base: 3000,
    namespace: 'arppeptide-com',
    key: 'visits',
    perSession: true
  }
};
