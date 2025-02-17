import Container from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import {
  BookOpenIcon,
  ChevronRightIcon,
  MessagesSquareIcon,
  ThumbsUpIcon,
} from "lucide-react";

export default function Vision() {
  return (
    <>
      {/* Icon Blocks */}
      <Container className="container max-w-screen-xl  mx-auto py-24 lg:py-32 pb-8 lg:pb-8 text-lg">
        <Badge className="mb-4 text-sm">Küldetésünk</Badge>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="lg:w-3/4">
            <h2 className="scroll-m-20 border-b pb-4 text-4xl tracking-tight leading-tight transition-colors first:mt-0">
              Szívügyünk az informatikai oktatás színvonalának növelése!
            </h2>
            <p className="mt-6 text-muted-foreground">
              Célunk az informatikai oktatás minőségének növelése, a diákok és a
              tanárok támogatása, valamint a szakma iránti érdeklődés
              felkeltése. Az informatikai oktatásban a legjobb diákok mérhetik
              össze tudásukat.
            </p>
            <p className="mt-5 text-muted-foreground">
              A versenyeken a diákok a legújabb technológiákat és eszközöket
              használhatják, és a legjobb szakemberek segítségével fejleszthetik
              tudásukat.
            </p>
            <p className="mt-5">
              <a
                className="inline-flex items-center gap-x-1 group font-medium hover:underline underline-offset-4 "
                href="#"
              >
                Ezen versenyeket szervezzük
                <ChevronRightIcon className="flex-shrink-0 w-4 h-4 transition ease-in-out group-hover:translate-x-1" />
              </a>
            </p>
          </div>
          {/* End Col */}
          <div className="space-y-6 lg:space-y-10">
            {/* Icon Block */}
            <div className="flex hover:bg-secondary/90 p-4 rounded-xl duration-200 ease-in-out">
              {/* Icon */}
              <span className="flex-shrink-0 inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border bg-primary text-primary-foreground">
                <BookOpenIcon className="flex-shrink-0 w-5 h-5" />
              </span>
              <div className="ms-5 sm:ms-8">
                <h3 className="text-base sm:text-lg font-semibold">
                    Az informatikai áttörések hírvivője
                </h3>
                <p className="mt-1 text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat saepe fugiat aspernatur dolor dolores eligendi. Temporibus, aut iusto?
                </p>
              </div>
            </div>
            {/* End Icon Block */}
            {/* Icon Block */}
            <div className="flex hover:bg-secondary/90 p-4 rounded-xl duration-200 ease-in-out">
              {/* Icon */}
              <span className="flex-shrink-0 inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border  bg-primary text-primary-foreground">
                <MessagesSquareIcon className="flex-shrink-0 w-5 h-5" />
              </span>
              <div className="ms-5 sm:ms-8">
                <h3 className="text-base sm:text-lg font-semibold">
                    Open-source contributions
                </h3>
                <p className="mt-1 text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed suscipit totam voluptates quae quas. Nisi est ullam suscipit beatae placeat!
                </p>
              </div>
            </div>
            {/* End Icon Block */}
            {/* Icon Block */}
            <div className="flex hover:bg-secondary/90 p-4 rounded-xl duration-200 ease-in-out">
              {/* Icon */}
              <span className="flex-shrink-0 inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border bg-primary text-primary-foreground">
                <ThumbsUpIcon className="flex-shrink-0 w-5 h-5" />
              </span>
              <div className="ms-5 sm:ms-8">
                <h3 className="text-base sm:text-lg font-semibold">
                  Simple and affordable
                </h3>
                <p className="mt-1 text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem sunt obcaecati, odit voluptas veritatis vero!
                </p>
              </div>
            </div>
            {/* End Icon Block */}
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </Container>
      {/* End Icon Blocks */}
    </>
  );
}
