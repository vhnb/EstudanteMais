import styles from './styles.module.css'
import { useSession } from 'next-auth/react'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { db } from '../../service/firebaseConnection'
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
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

interface CommentsProps {
    id: string,
    postId: string,
    comment: string,
    userName: string,
    userMail: string
}

export default function Postagens({ user }: HomeProps) {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<PostsProps[]>([])
    const [comments, setComments] = useState<{ [key: string]: CommentsProps[] }>({})
    const [inputComment, setInputComment] = useState("")

    useEffect(() => {
        async function LoadPosts() {
            const postsRef = collection(db, 'posts')
            const q = query(postsRef)

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
    }, [])

    function LoadComments(postId: string) {
        const commentsRef = collection(db, 'comments')
        const q = query(commentsRef, where('postId', '==', postId))

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

            setComments(prevComments => ({
                ...prevComments,
                [postId]: listaComments
            }))
        })
    }

    async function handleComment(event: FormEvent, postId: string) {
        event.preventDefault()

        if (inputComment === '') {
            toast.info("Preencha os campos.")
            return
        }

        try {
            await addDoc(collection(db, 'comments'), {
                postId,
                comment: inputComment,
                userName: session?.user?.name,
                userMail: session?.user?.email
            })
            setInputComment('')
            toast.success("Comentário enviado.")
        } catch (error) {
            console.log(error)
            toast.info(`Você precisa estar logado pra comentar.`)
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.contentPosts}>
                {posts.map((item) => (
                    <div className={styles.cardPost} key={item.id} onMouseEnter={() => LoadComments(item.id)}>
                        <h1>{item.postTitle}</h1>
                        <h2>{item.postContent}</h2>
                        <span>{item.matter}</span>
                        <p>Por: {item.userName}</p>
                        <img src={item.postImage} alt="Imagem da postagem" />
                        <form onSubmit={(event) => handleComment(event, item.id)}>
                            <input value={inputComment} onChange={(event: ChangeEvent<HTMLInputElement>) => setInputComment(event.target.value)} type="text" placeholder='Enviar um comentário...' />
                        </form>
                        {comments[item.id]?.map((comment) => (
                            <div className={styles.cardComment} key={comment.id}>
                                <h3>{comment.userName}</h3>
                                <h4>{comment.comment}</h4>
                            </div>
                        ))}
                    </div>
                ))}
                {posts.length === 0 && (
                    <p>Nenhuma postagem encontrada...</p>
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