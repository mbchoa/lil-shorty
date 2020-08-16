const app = new Vue({
  el: '#app',
  data: {
    url: '',
    slug: '',
    created: null,
    error: null,
  },
  methods: {
    async createUrl() {
      try {
        const response = await fetch('/create', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            url: this.url,
            slug: this.slug,
          }),
        });
        const payload = await response.json();
        if (payload.statusCode >= 400) {
          throw new Error(payload.message);
        }
        this.created = payload;
        this.error = null;
      } catch (err) {
        this.created = null;
        this.error = err.message || 'Unable to created shortened link';
      }
    },
  },
});
