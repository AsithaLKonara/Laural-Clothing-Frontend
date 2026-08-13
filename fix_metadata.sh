for page in about contact returns sale track-order; do
  mv app/$page/page.tsx app/$page/ClientContent.tsx
  
  # Remove the metadata export from the ClientContent
  sed -i '' '/export const metadata/,+3d' app/$page/ClientContent.tsx
  
  # Ensure "use client" is at the top of ClientContent
  # (It should already be, since we removed the metadata that was inserted at the top)
  
  # Create Server Component wrapper
  cat << INNER_EOF > app/$page/page.tsx
import ClientContent from "./ClientContent";

export const metadata = {
  title: "$(echo $page | awk '{print toupper(substr($0,1,1)) substr($0,2)}') - Laural Clothing",
  description: "$(echo $page | awk '{print toupper(substr($0,1,1)) substr($0,2)}') page for Laural Clothing."
};

export default function Page() {
  return <ClientContent />;
}
INNER_EOF

  # Rename the exported component in ClientContent to ClientContent
  # This is a bit tricky with sed, but let's just do a naive replace
  sed -i '' 's/export default function [a-zA-Z0-9_]*/export default function ClientContent/' app/$page/ClientContent.tsx

done
