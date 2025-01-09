function toggleImageUrlInput()
{
	let imageRequiredBox=document.querySelector('[name="imageRequired"]');
	let imageUrlDiv=document.querySelector('#imageUrlInput');
	if(imageRequiredBox.checked)
		imageUrlDiv.style.display='block';
	else
		imageUrlDiv.style.display='none';
}