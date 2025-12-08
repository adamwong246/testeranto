export const chromiumCommand = `
                # Wait for browserless/chrome to be ready
                echo "Waiting for browserless/chrome to be ready..."
                MAX_CHROMIUM_RETRIES=30
                CHROMIUM_RETRY_COUNT=0
                while [ $CHROMIUM_RETRY_COUNT -lt $MAX_CHROMIUM_RETRIES ]; do
                  if curl -s http://chromium:3000/health 2>/dev/null | grep -q '"ready":true'; then
                    echo "✅ browserless/chrome is ready"
                    break
                  fi
                  echo "browserless/chrome not ready yet (attempt $((CHROMIUM_RETRY_COUNT+1))/$MAX_CHROMIUM_RETRIES)"
                  CHROMIUM_RETRY_COUNT=$((CHROMIUM_RETRY_COUNT+1))
                  sleep 2
                done
                if [ $CHROMIUM_RETRY_COUNT -eq $MAX_CHROMIUM_RETRIES ]; then
                  echo "⚠️ browserless/chrome may not be fully ready, but proceeding anyway"
                fi
                `;
