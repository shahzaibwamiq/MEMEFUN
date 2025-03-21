'use client'
import Footer from "@/components/partials/footer";
import Profilelist from "@/components/proflielist/profilelist";
import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function Mytoken() {
  return (
    <>
      <Breadcrum title="My Tokens" />
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
