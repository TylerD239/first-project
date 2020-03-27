import React, {useState, useCallback, useContext, useEffect} from 'react'
// import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {LinksList} from '../components/LinksList' 
import {Loader} from '../components/Loader' 

export const LinksPage = () => {
	const {token} = useContext(AuthContext)
	const {request, loading} = useHttp()
	const [links, setLink] = useState([])

	const fetchLinks = useCallback(async () => {
		try {
			const fetched = await request(`/api/link`, 'GET', null, {
				Authorization: `Bearer ${token}`
			})
			setLink(fetched)
		} catch (e) {

		}
	}, [token, request])

	useEffect( () => {
		fetchLinks()
	}, [fetchLinks])

	if (loading) {
		return <Loader />
	}
	return (
		<>
			{!loading && <LinksList links={links} />}
		</>
	)
}