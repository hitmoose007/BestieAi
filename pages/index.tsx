import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import TodoList from "../components/Todo";

function Home() {
  const data = [
    {
      task_name: "Plan a trip to Austin, TX",
      subtasks: [
        {
          name: "Book flights",
          description:
            "Find and book the most suitable and affordable flights to Austin.",
          done: false,
        },
        {
          name: "Find accommodations",
          description:
            "Research and book suitable accommodations in Austin for the duration of your stay.",
          done: false,
        },
        {
          name: "Create a list of attractions to visit",
          description:
            "Research the top attractions and activities in Austin and create a list of places you'd like to visit during your trip.",
          done: false,
        },
        {
          name: "Plan dining experiences",
          description:
            "Find popular Austin restaurants, cafes, and bars to visit during your trip.",
          done: false,
        },
        {
          name: "Create a daily itinerary",
          description:
            "Organize your activities, attractions, and meals into a daily schedule to make the most of your time in Austin.",
          done: false,
        },
      ],
    },
    {
      task_name: "Spring cleaning",
      subtasks: [
        {
          name: "Clean out closet",
          description:
            "Sort through clothes and donate or discard items that are no longer needed.",
          done: false,
        },
        {
          name: "Organize bookshelf",
          description: "Arrange books by author, genre, or color.",
          done: false,
        },
        {
          name: "Deep clean bathroom",
          description:
            "Scrub the bathtub, sink, and toilet; mop the floor; and wipe down surfaces.",
          done: false,
        },
        {
          name: "Clean windows",
          description: "Wash windows and clean blinds or curtains.",
          done: false,
        },
        {
          name: "Dust and vacuum",
          description:
            "Dust surfaces and vacuum carpets, rugs, and upholstery.",
          done: false,
        },
      ],
    },
    {
      task_name: "Learn a new language",
      subtasks: [
        {
          name: "Choose a language",
          description:
            "Decide which language to learn based on personal interests or professional goals.",
          done: false,
        },
        {
          name: "Find resources",
          description:
            "Research language-learning resources such as textbooks, online courses, and language exchange programs.",
          done: false,
        },
        {
          name: "Practice speaking and writing",
          description:
            "Improve speaking and writing skills by practicing with native speakers or language exchange partners.",
          done: false,
        },
        {
          name: "Watch foreign films",
          description:
            "Improve listening skills by watching foreign films or TV shows with subtitles.",
          done: false,
        },
        {
          name: "Take a trip to a country where the language is spoken",
          description:
            "Immerse oneself in the language and culture by taking a trip to a country where the language is spoken.",
          done: false,
        },
      ],
    },
  ];

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 p-3 bg-zinc-300 ">
        <Chat />
      </div>

      <div className="w-1/2 p-3 bg-zinc-300 ">
        <div className="bg-white mt-16 overflow-y-scroll scrollbar-thin rounded-2xl max-h-[calc(100vh-6.1rem)] min-h-[calc(100vh-6.1rem)]">
          {data.map((data, index) => (
            <TodoList key={index} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
