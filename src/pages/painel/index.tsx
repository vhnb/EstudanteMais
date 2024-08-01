import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react'
import { db } from '../../service/firebaseConnection'
import { addDoc, collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HomeProps {
    user: {
        email: string
    }
}

interface PostsProps {
    id: string,
    created: Date,
    postTitle: string,
    postContent: string,
    postImage: string,
    matter: string,
    userName: string,
    userMail: string
}

interface NotesProps {
    id: string,
    created: Date,
    noteTitle: string,
    noteContent: string,
    noteImage: string,
    userName: string,
    userMail: string
}

interface CommentsProps {
    id: string,
    postId: string,
    comment: string,
    userName: string,
    userMail: string
}

export default function Painel({ user }: HomeProps) {
    const { data: session } = useSession()
    const [activeSection, setActiveSection] = useState('Anotações')
    const [inputPostTitle, setInputPostTitle] = useState('')
    const [inputPostContent, setInputPostContent] = useState('')
    const [inputPostImage, setInputPostImage] = useState('')
    const [inputSelectMatter, setInputSelectMatter] = useState('Matemática')
    const [inputNoteTitle, setInputNoteTitle] = useState('')
    const [inputNoteContent, setInputNoteContent] = useState('')
    const [inputNoteImage, setInputNoteImage] = useState('')
    const [posts, setPosts] = useState<PostsProps[]>([])
    const [comments, setComments] = useState<CommentsProps[]>([])
    const [notes, setNotes] = useState<NotesProps[]>([])

    useEffect(() => {
        async function LoadPosts() {
            const postsRef = collection(db, 'posts')
            const q = query(postsRef, where('userMail', '==', user?.email))

            onSnapshot(q, (snapshot) => {
                let listaPosts = [] as PostsProps[]

                snapshot.forEach((doc) => {
                    listaPosts.push({
                        id: doc.id,
                        created: doc.data().created,
                        postTitle: doc.data().postTitle,
                        postContent: doc.data().postContent,
                        postImage: doc.data().postImage,
                        matter: doc.data().matter,
                        userName: doc.data().userName,
                        userMail: doc.data().userMail
                    })
                })
                setPosts(listaPosts)
            })
        }
        LoadPosts()
    }, [session?.user?.email])

    useEffect(() => {
        async function LoadComments() {
            const commentsRef = collection(db, 'comments')
            const q = query(commentsRef, where('userMail', '==', user?.email))

            onSnapshot(q, (snapshot) => {
                let listaComments = [] as CommentsProps[]

                snapshot.forEach((doc) => {
                    listaComments.push({
                        id: doc.id,
                        postId: doc.data().postId,
                        comment: doc.data().comment,
                        userName: doc.data().userName,
                        userMail: doc.data().userMail,
                    })
                })

                setComments(listaComments)
            })
        }
        LoadComments()
    }, [session?.user?.email])

    useEffect(() => {
        async function LoadNotes() {
            const notesRef = collection(db, 'notes')
            const q = query(notesRef, where('userMail', '==', user?.email))

            onSnapshot(q, (snapshot) => {
                let listaNotes = [] as NotesProps[]

                snapshot.forEach((doc) => {
                    listaNotes.push({
                        id: doc.id,
                        created: doc.data().created,
                        noteTitle: doc.data().noteTitle,
                        noteContent: doc.data().noteContent,
                        noteImage: doc.data().noteImage,
                        userName: doc.data().userName,
                        userMail: doc.data().userMail
                    })
                })
                setNotes(listaNotes)
            })
        }
        LoadNotes()
    }, [])

    async function handleRegisterPost(event: FormEvent) {
        event.preventDefault()

        if (inputPostTitle === '' || inputPostContent === '' || inputPostImage === '') {
            toast.info("Preencha os campos.")
            return
        }

        try {
            await addDoc(collection(db, 'posts'), {
                postTitle: inputPostTitle,
                postContent: inputPostContent,
                postImage: inputPostImage,
                matter: inputSelectMatter,
                created: new Date(),
                userName: session?.user?.name,
                userMail: session?.user?.email
            })

            setInputPostTitle('')
            setInputPostContent('')
            setInputPostImage('')
            setInputSelectMatter('Matemática')
            toast.success("Postagem enviada.")
        } catch (error) {
            console.log(error)
            toast.error(`Erro: ${error}`)
        }
    }

    async function handleRegisterNote(event: FormEvent) {
        event.preventDefault()

        if (inputNoteTitle === '' || inputNoteContent === '' || inputNoteImage === '') {
            toast.info("Preencha os campos.")
            return
        }

        try {
            await addDoc(collection(db, 'notes'), {
                noteTitle: inputNoteTitle,
                noteContent: inputNoteContent,
                noteImage: inputNoteImage,
                created: new Date(),
                userName: session?.user?.name,
                userMail: session?.user?.email
            })
            setInputNoteTitle('')
            setInputNoteContent('')
            setInputNoteImage('')
            toast.success("Anotação salva.")
        } catch (error) {
            console.log(error)
            toast.error(`Erro: ${error}`)
        }
    }

    async function handleDeletePost(id: string) {
        const docRef = doc(db, 'posts', id)
        await deleteDoc(docRef)
        toast.success("Postam deletada com sucesso.")
    }

    async function handleDeleteComment(id: string) {
        const docRef = doc(db, 'comments', id)
        await deleteDoc(docRef)
        toast.success("Comentário deletado com sucesso.")
    }

    async function handleDeleteNote(id: string){
        const docRef = doc(db, 'notes', id)
        await deleteDoc(docRef)
        toast.success("Anotação deletada com sucesso.")
    }

    return (
        <main className={styles.container}>
            <div className={styles.containerPanel}>
                <div className={styles.contentPanel}>
                    <h1>Painel de estudos</h1>
                    <div className={styles.optionsPanel}>
                        <button className={activeSection === 'Anotações' ? styles.active : ''} onClick={() => setActiveSection('Anotações')}>Anotações</button>
                        <button className={activeSection === 'Postar' ? styles.active : ''} onClick={() => setActiveSection('Postar')}>Postar</button>
                        <button className={activeSection === 'Comentários' ? styles.active : ''} onClick={() => setActiveSection('Comentários')}>Comentários</button>
                    </div>
                </div>
            </div>
            <div className={styles.containerOptionSelected}>
                {activeSection === 'Anotações' && (
                    <div className={styles.sectionOptionSelected}>
                        <h1>Se organize</h1>
                        <p>Adicione notas pessoais para lhe ajudar a se organizar.</p>
                        <form onSubmit={handleRegisterNote}>
                            <input value={inputNoteTitle} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputNoteTitle(event.target.value)} type="text" placeholder='Título da anotação...' />
                            <textarea value={inputNoteContent} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInputNoteContent(event.target.value)} placeholder='Conteúdo da anotação...' />
                            <input value={inputNoteImage} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputNoteImage(event.target.value)} type="text" placeholder='Imagem da anotação...' />
                            <button type='submit'>Salvar</button>
                        </form>
                        <div className={styles.line}></div>
                        {notes.map((item) => (
                            <details>
                                <summary>
                                    {item.noteTitle}
                                </summary>
                                <h2>{item.noteContent}</h2>
                                <img src={item.noteImage} alt="Image Note" />
                                <button onClick={() => handleDeleteNote(item.id)}>Excluir nota</button>
                            </details>
                        ))}
                        {notes.length === 0 && (
                            <p>Sem anotações...</p>
                        )}
                    </div>
                )}
                {activeSection === 'Postar' && (
                    <div className={styles.sectionOptionSelected}>
                        <h1>Poste no que esta pensando</h1>
                        <p>Poste dicas, dúvidas e até mesmo curiosidades sobre alguma matéria.</p>
                        <form onSubmit={handleRegisterPost}>
                            <input value={inputPostTitle} type="text" onChange={(event: ChangeEvent<HTMLInputElement>) => setInputPostTitle(event.target.value)} placeholder='Título da postagem...' />
                            <textarea value={inputPostContent} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInputPostContent(event.target.value)} placeholder='Conteúdo da postagem...' />
                            <input value={inputPostImage} type="text" onChange={(event: ChangeEvent<HTMLInputElement>) => setInputPostImage(event.target.value)} placeholder='URL Imagem da postagem...' />
                            <select value={inputSelectMatter} onChange={(event: ChangeEvent<HTMLSelectElement>) => setInputSelectMatter(event.target.value)} name="Matérias">
                                <option value="Matemática">Matemática</option>
                                <option value="Português">Português</option>
                                <option value="Física">Física</option>
                                <option value="História">História</option>
                                <option value="Geografia">Geografia</option>
                                <option value="Química">Química</option>
                                <option value="Biologia">Biologia</option>
                                <option value="Inglês">Inglês</option>
                            </select>
                            <button type='submit'>Enviar</button>
                        </form>
                        <div className={styles.line}></div>
                        {posts.map((item) => (
                            <div className={styles.cardPost} key={item.id}>
                                <h1>{item.postTitle}</h1>
                                <h2>{item.postContent}</h2>
                                <span>{item.matter}</span>
                                <img src={item.postImage} alt="Imagem da postagem" />
                                <button onClick={() => handleDeletePost(item.id)}>Excluir postagem</button>
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <p>Sem postagens...</p>
                        )}
                    </div>
                )}
                {activeSection === 'Comentários' && (
                    <div className={styles.sectionOptionSelected}>
                        <h1>Seus comentários</h1>
                        <p>Veja seus comentários em outras postagens.</p>
                        {comments.map((comment) => (
                            <div className={styles.cardComment} key={comment.id}>
                                <div className={styles.contentComment}>
                                    <h3>{comment.userName}</h3>
                                    <h4>{comment.comment}</h4>
                                    <h5>ID da postagem: {comment.postId}</h5>
                                </div>
                                <button onClick={() => handleDeleteComment(comment.id)}>Excluir comentário</button>
                            </div>
                        ))}
                        {comments.length === 0 && (
                            <p>Sem comentários...</p>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}