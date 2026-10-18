FROM nginx:1.25-alpine

# Remove default configuration file
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
