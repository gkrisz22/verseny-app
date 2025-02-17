import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { HeroParticles } from "./hero-particle";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ChevronRightIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        {/* End Gradients */}
        <HeroParticles />
        <Container className=" mx-auto max-w-screen-xl">
          <div className="relative z-10">
            <div className="container py-10 lg:py-16">
              <div className="max-w-2xl text-center mx-auto">
                <div className="relative rounded-full w-fit mx-auto">
                    <Button className="inline-flex items-center gap-x-1 group rounded-full font-medium hover:underline underline-offset-4 " variant={"outline"}>
                        🎉 Már elérhetőek az új versenyek
                        <ChevronRightIcon className="flex-shrink-0 w-4 h-4 transition ease-in-out group-hover:translate-x-1" />
                    </Button>
                    <BorderBeam duration={6} size={50} />
                </div>
                {/* Title */}
                <div className="mt-5 max-w-2xl">
                  <h1 className="scroll-m-20 font-medium font-heading text-4xl tracking-tight lg:text-5xl">
                    <TextAnimate animation="blurInUp" by="character" once duration={0.8}>
                      IK Tehetség
                    </TextAnimate>
                  </h1>
                </div>

                <div className="mt-5 max-w-3xl">
                  <div className="text-lg text-muted-foreground">
                    <TextAnimate animation="fadeIn" by="line" once duration={0.8}>
                        Az ELTE Informatikai Karának tehetséggondozó programja, ahol minden diák egyenlő esélyekkel indulhat.
                    </TextAnimate>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 gap-3 flex justify-center">
                  <Button size={"lg"}>Bemutatkozás</Button>
                  <Button size={"lg"} variant={"outline"}>
                    Versenyeink
                  </Button>
                </div>
                {/* End Buttons */}
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* End Hero */}
    </>
  );
}
