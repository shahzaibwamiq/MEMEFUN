import Footer from "@/components/partials/footer";
import Profilelist from "@/components/proflielist/profilelist";
import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function Mywishlist() {
  return (
    <>
      <Breadcrum title="My Wishlist" />
      <section className="mywishlist_sec">
        <div className="container">
            <div className="row">
                <div className="col-12">

                <Profilelist />
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
