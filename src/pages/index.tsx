import styles from "@/styles/Home.module.css";
import { MdOutlineArrowOutward } from "react-icons/md";

export default function Home() {
  return (
    <main className={styles.container}>
      <h1>Dificuldade para <span>estudar?</span></h1>
      <p>Conheça nossa plataforma simples e fácil para ajudar os estudantes a se organizar em seus estudos.</p>
      <a href="/painel">Acessar o painel <MdOutlineArrowOutward className={styles.iconHome}/></a>
    </main>
  );
}
