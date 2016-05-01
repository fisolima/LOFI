package lofi.controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lofi.DAL.DealRepository;
import lofi.models.Deal;
import lofi.models.DealReservation;

@WebServlet(name = "DealController", urlPatterns = {"/deals"})
public class DealController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setContentType("application/json");
        
        String connectionString = getServletContext().getInitParameter("MySQLConnection");
        
        DealRepository repository = new DealRepository(connectionString);
        
        try{
            double posX = Double.parseDouble(request.getParameter("x"));
            double posY = Double.parseDouble(request.getParameter("y"));
            
            List<Deal> deals = repository.GetDeals(posX, posY);
        
            PrintWriter out = response.getWriter();

            Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();

            out.print(gson.toJson(deals));

            out.flush();
        }
        catch (Exception exc){
            response.setContentType("text/html");
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            PrintWriter out = response.getWriter();
            out.print(exc.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {        
        StringBuilder json = new StringBuilder();
        String line;
        
        BufferedReader reader = request.getReader();
        
        while ((line = reader.readLine()) != null)
          json.append(line);
        
        Gson gson = new Gson();
        
        DealReservation reservation = gson.fromJson(json.toString(), DealReservation.class);
        
        String connectionString = getServletContext().getInitParameter("MySQLConnection");
        
        DealRepository repository = new DealRepository(connectionString);
        
        try{
            repository.AddDealReservation(reservation);
        }
        catch (Exception exc){
            response.setContentType("text/html");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            PrintWriter out = response.getWriter();
            out.print(exc.getMessage());
        }        
    }

    @Override
    public String getServletInfo() {
        return "Deal controller";
    }

}
