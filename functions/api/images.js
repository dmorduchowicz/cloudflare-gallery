// cloudflare-image-page/functions/api/images.js

export async function onRequest(context) {
    // Access your Cloudflare Account ID and API Token securely from environment variables
    const accountId = context.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = context.env.CLOUDFLARE_IMAGES_TOKEN;
  
    // Basic check to ensure the token is available
    if (!apiToken || !accountId) {
      return new Response(
        "Cloudflare API token or Account ID not configured for the function. Check Pages settings.",
        { status: 500 }
      );
    }
  
    try {
      // Make the authenticated request to the Cloudflare Images API
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Use the Bearer token for authentication
            "Content-Type": "application/json",
          },
        }
      );
  
      // Check if the API call was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudflare Images API error response:", errorData);
        return new Response(
          `Error from Cloudflare Images API: ${
            errorData.errors ? errorData.errors[0].message : response.statusText
          }`,
          { status: response.status }
        );
      }
  
      // Parse the JSON response from Cloudflare
      const data = await response.json();
  
      // Return the image data as a JSON response to your frontend
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      // Catch any network or unexpected errors
      console.error("Error in Cloudflare Pages Function:", error);
      return new Response("Internal server error during image fetch from function.", {
        status: 500,
      });
    }
  }