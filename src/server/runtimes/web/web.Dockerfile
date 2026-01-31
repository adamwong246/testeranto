# FROM alpine:latest

# # 1. Install Chromium + socat (the bridge) + fonts (for screenshots)
# RUN apk add --no-cache chromium socat ttf-freefont font-noto

# # 2. Start socat to listen on 9222 and forward to Chromium on 9223
# # 3. Start Chromium listening on 9223
# RUN echo '#!/bin/sh\n\
# socat TCP-LISTEN:9222,fork,reuseaddr TCP:127.0.0.1:9223 &\n\
# exec chromium-browser \
#     --headless=new \
#     --no-sandbox \
#     --disable-gpu \
#     --remote-debugging-port=9223 \
#     --remote-allow-origins=* \
# ' > /start.sh && chmod +x /start.sh

# EXPOSE 9222
# ENTRYPOINT ["/bin/sh", "/start.sh"]