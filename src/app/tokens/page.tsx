'use client'

import AdminTokens from "@/components/tokensList/admin_tokens";
import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function Mytoken() {
  return (
    <>
      {/* Breadcrumb for navigation, displaying "My Tokens" as the title */}
      <Breadcrum title="My Tokens" />

      {/* Consider renaming this class if it's specific to "Wishlist" */}
      <section className="mywishlist_sec">
        <div className="container">
          <div className="row">
            <div className="col-12">

              {/* Profile List Component - Displays token-related data */}
              <AdminTokens />

            </div>
          </div>
        </div>
      </section>

    </>
  );
};
