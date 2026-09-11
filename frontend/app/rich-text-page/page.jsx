import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";

export const metadata = { title: "Rich text" };

export default function RichTextPage() {
  return (
    <Shell>
      <article className="at-inner at-enter">
        <p className="at-kicker">Jump to</p>
        <p>
          <a className="at-link" href="#s1">/ First Section</a>{" "}
          <a className="at-link" href="#s2">/ Second Section</a>{" "}
          <a className="at-link" href="#s3">/ Third Section</a>
        </p>
        <h1 id="s1">First Section</h1>
        <p>Donec ullamcorper nulla non metus auctor fringilla. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
        <h1 id="s2">Second Section</h1>
        <p>Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.</p>
        <h1 id="s3">Third Section</h1>
        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Maecenas faucibus mollis interdum.</p>
      </article>
      <Footer />
    </Shell>
  );
}
