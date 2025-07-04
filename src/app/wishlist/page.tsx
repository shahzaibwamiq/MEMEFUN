import Profilelist from "@/components/proflielist/profilelist";
import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function Mywishlist() {
  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrum title="My Wishlist" />

      <section className="mywishlist_sec">
        <div className="container">
          <div className="row">
            <div className="col-12">

              {/* Profile List Component - Displays the wishlist items */}
              <Profilelist />

            </div>
          </div>
        </div>
      </section>

    </>
  );
};
