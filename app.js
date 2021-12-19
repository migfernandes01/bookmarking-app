//===============Part 1 - Input==================================
        //grab everything we need
        const body = document.querySelector("body");
        const input = document.querySelector(".bookmark-form");
        const overlay = document.querySelector(".overlay");

        //action function
        function showFloater(){
            console.log("floater clicked");
            body.classList.add("show-floater");
        }
        function closeFloater(){
            console.log("overlay clicked");
            //if body element contains class "show-floater", remove it
            if(body.classList.contains("show-floater")){
                body.classList.remove("show-floater");
            }
        }

        //add event listeners
        input.addEventListener("focusin", showFloater); //when user clicks or tabs into textbox
        input.addEventListener("focusout", closeFloater); //when user focus out of textbox
        overlay.addEventListener("click", closeFloater); //when user clicks the overlay box(everything except for input box)
    
        //=================Part 2 - Items===============================
        
        //-----------------------grab what we need---------------------
        const bookmarksList = document.querySelector(".bookmarks-list");
        const bookmarkForm = document.querySelector(".bookmark-form");
        const bookmarkInput = bookmarkForm.querySelector("input[type=text]");
        
        //API keys(open graph)
        const apiUrl = "https://opengraph.io/api/1.1/site";
        const appId  = "8ebf327d-e276-465a-95dc-f06fac66dce5"; /*PERSONAL KEY(100/month)*/

        //bookmarks gets bookmarks array from localStorage OR creates a new empty array
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        //console.table(bookmarks);
        //fill bookmarkList(div with class="bookmarks-list") once we get it from localStorage
        fillBookmarkList(bookmarks); //call function to fill list with array of bookmarks

        //-------------------------action functions------------------------
        //function that will create a bookmark
        function createBookmark(e){ //take event "e"
            e.preventDefault(); //prevent from auto refresh page

            if(!bookmarkInput.value){
                alert("We need info!");
                return;
            }

            if(detectUrls(bookmarkInput.value)){
                console.log("URL detected");
                const url = encodeURIComponent(bookmarkInput.value); //encode URL from input form
                //add a new bookmark to the bookmarks array
                //fetch data(our URL + api URL + api Key)
                fetch(apiUrl + "/" + url + "?app_id=" + appId)
                    .then(response => response.json())//get json of response
                    .then(data => {//get data using the json function
                        //object bookmark with title element
                        const bookmark = {
                            title: data.hybridGraph.title,
                            image: data.hybridGraph.image,
                            link : data.hybridGraph.url
                        };

                        bookmarks.push(bookmark); //push bookmark object to bookmarks array
                        fillBookmarkList(bookmarks); //call function to fill list with array of bookmarks
                        storeBookmarks(bookmarks); //call function to store bookmarks on localStorage           
                        bookmarkForm.reset();//reset form
                    })
                    .catch(error => { //catch errors during fetching data process
                        alert("There was a problem getting info!");
                    });   
            }else{
                const title = bookmarkInput.value;
                //object bookmark with title element
                const bookmark = {
                    title: title,
                    image: "img/no_img.png",
                    link : "#"
                };

                bookmarks.push(bookmark); //push bookmark object to bookmarks array
                fillBookmarkList(bookmarks); //call function to fill list with array of bookmarks
                storeBookmarks(bookmarks); //call function to store bookmarks on localStorage           
                bookmarkForm.reset();//reset form
            }
        }

        //function to fill bookmark list on HTML(receives list of bookmarks)
        function fillBookmarkList(bookmarks = []){ //default of empty array as parameter
            /*let bookmarksHtml = ""; 

            //for each item on bookmarks list, add HTML <a>
            for(let i = 0; i < bookmarks.length; i++){
                bookmarksHtml += `
                    <a href="#" class="bookmark">
                        ${bookmarks[i].title}
                    </a>
                `;
                
            }----------------OR: -------------------------*/
            
            //reformat bookmarks array to HTML code for each item on bookmark to be a <a> element
            const bookmarksHtml = bookmarks.map((bookmark, i) => {
                return `
                        <a href="${bookmark.link}" onclick="return false;" target="_blank" class="bookmark" data-id="${i}">
                            <div class="img" style="background-image:url('${bookmark.image}')"></div>
                            <div class="title">${bookmark.title}</div>
                            <span class="bi bi-x"></span>
                        </a>
                        `;
            }).join(""); //join items
            bookmarksList.innerHTML = bookmarksHtml; //add HTML <a> to bookmarksList(div with class="bookmarks-list")
        }

        //function that takes bookmarks and stores them in localStorage
        function storeBookmarks(bookmarks = []){
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); //ket of bookmarks, value of the string element in bookmarks
        }

        //
        function removeBookmark(e){
            
            if(e.target.classList.value != "bi bi-x"){ //if click is not on item with class="bi-x"(x)
                if(e.target.parentNode.getAttribute('href') != '#'){ //if item is a link
                    let newPage = e.target.parentNode.getAttribute('href'); //get link
                    window.open(newPage, '_blank'); //open it in a new page
                }
                return;
            }
            
            //if click was on the X  
            //find the index
            const index = e.target.parentNode.dataset.id; //get the parent node of cross span (<a> element with the id of the item)

            //remove from bookmarks list using splice
            bookmarks.splice(index, 1); //remove item with that index from bookmarks(remove only 1 item(the one clicked))

            //fill list 
            fillBookmarkList(bookmarks);

            //store back to localStorage 
            storeBookmarks(bookmarks);
            e.stopPropagation();
        }
        //
        function detectUrls(input){
            let urlRegex =  /(((https?:\/\/)|(www\.))[^\s]+)/g;
            return input.match(urlRegex);
        }

        //-----------------------add event listener-------------------
        
        bookmarkForm.addEventListener("submit", createBookmark);//when user clicks the button or presses enter, call createBookmark function
        bookmarksList.addEventListener("click", removeBookmark);//when clicking on the bookmarksList div