import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { HeroParticles } from "./hero-particle";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      <div className="relative overflow-hidden py-24 lg:py-32">
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        <HeroParticles />
        <Container className="mx-auto max-w-screen-xl md:pt-24">
          <div className="relative z-10 w-full">
            <div className="container py-10 lg:py-16 w-full">
              <div className="max-w-2xl text-center mx-auto">
                <div className="relative rounded-full w-fit mx-auto">
                    <Button asChild className="inline-flex items-center gap-x-1 group rounded-full font-medium hover:underline underline-offset-4 " variant={"outline"}>
                        <Link href={"/org/versenyek"}>
                        🎉 Már elérhetőek az új versenyek
                        <ChevronRightIcon className="flex-shrink-0 w-4 h-4 transition ease-in-out group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <BorderBeam duration={6} size={50} />
                </div>
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

                <div className="mt-8 gap-3 flex justify-center">
                  <Link href={"/select"}>
                    <Button size={"lg"}>Bejelentkezés</Button>
                  </Link>
                  <Link href={"/sign-up"}>
                    <Button size={"lg"} variant={"outline"}>
                      Regisztráció
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
